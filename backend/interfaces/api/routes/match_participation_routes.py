from typing import List
from uuid import UUID

# Import use cases
from application.use_cases.match import (
    FinishMatchUseCase,
    GetMatchParticipantsUseCase,
    JoinMatchUseCase,
)
from dtos.request.match.match_request_dto import MatchParticipationResultsDTO
from dtos.response.match.match_participants_response import MatchParticipantsResponseDTO
from dtos.response.match.match_response import MatchResponseDTO
from fastapi import APIRouter, Depends
from infrastructure.dependencies.use_cases.match_participations_use_cases import (
    get_finish_match_use_case,
    get_join_match_use_case,
    get_match_participants_use_case,
)
from infrastructure.logging import get_logger

match_participations_router = APIRouter()

# Configurar logger
logger = get_logger("match_participations_routes")


@match_participations_router.get(
    "/{match_id}/participants", response_model=MatchParticipantsResponseDTO
)
async def get_match_participants(
    match_id: UUID,
    use_case: GetMatchParticipantsUseCase = Depends(get_match_participants_use_case),
) -> List[str]:
    """
    Obtiene la lista de participantes de una partida.

    Args:
        match_id: ID único de la partida

    Returns:
        List[str]: Lista de IDs de usuarios participantes
    """
    logger.info(f"GET /matches/{match_id}/participants - Request received")

    return await use_case.execute(str(match_id))


@match_participations_router.post("/{match_id}/join", response_model=MatchResponseDTO)
async def join_match(
    match_id: UUID,
    use_case: JoinMatchUseCase = Depends(get_join_match_use_case),
) -> MatchResponseDTO:
    """
    Permite a un usuario unirse a una partida existente.

    Args:
        match_id: ID único de la partida
        join_data: Datos para unirse (bet_amount opcional)

    Returns:
        MatchResponseDTO: Datos actualizados de la partida
    """

    result = await use_case.execute(str(match_id))
    return result


@match_participations_router.put(
    "/{match_id}/finish_match", response_model=MatchResponseDTO
)
async def finish_match(
    match_id: UUID,
    participation_data: MatchParticipationResultsDTO,
    use_case: FinishMatchUseCase = Depends(get_finish_match_use_case),
) -> MatchResponseDTO:
    """
    Actualiza la puntuación de un usuario en una partida.

    Args:
        match_id: ID único de la partida
        score_data: Nueva puntuación del usuario

    Returns:
        MatchResponseDTO: Datos actualizados de la partida
    """
    return await use_case.execute(str(match_id), participation_data)
